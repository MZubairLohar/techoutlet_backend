import assert from 'node:assert/strict';
import test from 'node:test';
import bcrypt from 'bcryptjs';
import Accessory from '../models/Accessory.js';
import Admin from '../models/Admin.js';
import Appointment from '../models/Appointment.js';
import Blog from '../models/Blog.js';
import Mobile from '../models/Mobile.js';
import Service from '../models/Service.js';
import { createAccessory } from '../controllers/accessoryController.js';
import { loginAdmin } from '../controllers/authController.js';
import { getModelsByBrand, createBrand } from '../controllers/brandController.js';
import { createRepairingRequest } from '../controllers/appointmentController.js';
import { reactToBlog } from '../controllers/blogController.js';
import { getAllServices, createService } from '../controllers/serviceController.js';
import { sendAppointmentEmails } from '../utils/appointmentEmail.js';

const response = () => ({
  statusCode: 200,
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

const mockMethod = (t, model, method, implementation) => {
  const original = model[method];
  model[method] = implementation;
  t.after(() => {
    model[method] = original;
  });
};

test('admin login returns the nested token shape consumed by the frontend', async (t) => {
  const originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'contract-test-secret';
  t.after(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  });

  const passwordHash = await bcrypt.hash('password', 4);
  mockMethod(t, Admin, 'findOne', async () => ({
    _id: 'admin-1',
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: passwordHash,
  }));
  const res = response();

  await loginAdmin({ body: { email: ' ADMIN@EXAMPLE.COM ', password: 'password' } }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 200);
  assert.equal(typeof res.body.data.token, 'string');
});

test('GET services exposes the list at the frontend message key', async (t) => {
  const services = [{ _id: 'service-1', ServiceName: 'Screen Repair', price: 49 }];
  mockMethod(t, Service, 'find', async () => services);
  const res = response();

  await getAllServices({}, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, services);
  assert.equal(res.body.data, services);
});

test('service create accepts the frontend ServiceName and price payload', async (t) => {
  let created;
  mockMethod(t, Service, 'create', async (data) => {
    created = data;
    return data;
  });
  const res = response();

  await createService({ body: { ServiceName: 'Screen Repair', price: '49' } }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 201);
  assert.deepEqual(created, {
    ServiceName: 'Screen Repair',
    Description: undefined,
    price: '49',
    icon: '🔧',
  });
});

test('accessory create accepts the frontend singular image upload field', async (t) => {
  let created;
  mockMethod(t, Accessory, 'create', async (data) => {
    created = data;
    return data;
  });
  const res = response();

  await createAccessory({
    body: {
      name: 'Phone Case',
      category: 'cover',
      price: '25',
      compatibleModels: '["iphone15"]',
    },
    files: { image: [{ path: 'https://images.example/case.jpg' }] },
  }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 201);
  assert.deepEqual(created.images, ['https://images.example/case.jpg']);
  assert.deepEqual(created.compatibleModels, ['iphone15']);
});

test('brand creation accepts multipart models and matching images', async (t) => {
  let created;
  mockMethod(t, Mobile, 'findOne', async () => null);
  mockMethod(t, Mobile, 'create', async (data) => {
    created = data;
    return data;
  });
  const res = response();

  await createBrand({
    body: {
      brand: 'Apple',
      models: JSON.stringify([{ name: 'iPhone 15' }]),
    },
    files: { images: [{ path: 'https://images.example/iphone.jpg' }] },
  }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 201);
  assert.equal(created.brand, 'apple');
  assert.deepEqual(created.models, [{
    name: 'iPhone 15',
    image: 'https://images.example/iphone.jpg',
    isAvailable: true,
  }]);
});

test('models endpoint exposes a model array in the frontend message key', async (t) => {
  const models = [{ name: 'iPhone 15', image: 'https://images.example/iphone.jpg' }];
  mockMethod(t, Mobile, 'findOne', async () => ({ brand: 'apple', models }));
  const res = response();

  await getModelsByBrand({ params: { brand: 'Apple' } }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, models);
});

test('anonymous blog reaction accepts the frontend type-only payload', async (t) => {
  const blog = {
    likes: 2,
    dislikes: 1,
    reactions: [],
    async save() {},
  };
  mockMethod(t, Blog, 'findById', async () => blog);
  const res = response();

  await reactToBlog({ params: { id: 'blog-1' }, body: { type: 'like' } }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 200);
  assert.equal(blog.likes, 3);
  assert.equal(blog.dislikes, 1);
});

test('repair booking accepts the frontend request fields and returns message', async (t) => {
  let created;
  mockMethod(t, Appointment, 'create', async (data) => {
    created = data;
    return data;
  });
  const reqBody = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phoneNumber: '02012345678',
    mobileType: 'apple iPhone 15',
    problem: 'Screen Repair',
    comment: 'Cracked screen',
    AppointmentTime: '2026-12-25T10:00:00.000Z',
  };
  const res = response();

  const notifications = [];
  await createRepairingRequest(
    { body: reqBody },
    res,
    (error) => {
      throw error;
    },
    async (appointment) => {
      notifications.push(
        { recipient: 'info@techoutlet.uk', status: 'sent' },
        { recipient: appointment.email, status: 'sent' },
      );
      return notifications;
    },
  );

  assert.equal(res.statusCode, 201);
  assert.deepEqual(created, reqBody);
  assert.equal(res.body.message, created);
  assert.deepEqual(res.body.emailNotifications, [
    { recipient: 'info@techoutlet.uk', status: 'sent' },
    { recipient: reqBody.email, status: 'sent' },
  ]);
});

test('appointment emails go separately to the admin and booking customer', async () => {
  const sent = [];
  const transporter = {
    async sendMail(message) {
      sent.push(message);
    },
  };
  const appointment = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phoneNumber: '02012345678',
    mobileType: 'apple iPhone 15',
    problem: 'Screen <repair>',
    comment: '',
    AppointmentTime: '2026-12-25T10:00:00.000Z',
  };

  const results = await sendAppointmentEmails(appointment, transporter);

  assert.deepEqual(sent.map((message) => message.to), [
    'info@techoutlet.uk',
    'jane@example.com',
  ]);
  assert.deepEqual(results.map(({ status }) => status), ['sent', 'sent']);
  assert.match(sent[0].html, /Screen &lt;repair&gt;/);
  assert.equal(sent[0].replyTo, 'jane@example.com');
  assert.equal(sent[1].replyTo, 'info@techoutlet.uk');
});

test('email delivery failure for one recipient does not prevent sending to the other', async () => {
  const attempted = [];
  const transporter = {
    async sendMail(message) {
      attempted.push(message.to);
      if (message.to === 'info@techoutlet.uk') throw new Error('SMTP rejected admin');
    },
  };

  const results = await sendAppointmentEmails({
    name: 'Jane Doe',
    email: 'jane@example.com',
    phoneNumber: '02012345678',
    mobileType: 'apple iPhone 15',
    problem: 'Screen repair',
    AppointmentTime: '2026-12-25T10:00:00.000Z',
  }, transporter);

  assert.deepEqual(attempted, ['info@techoutlet.uk', 'jane@example.com']);
  assert.deepEqual(results.map(({ status }) => status), ['failed', 'sent']);
});
