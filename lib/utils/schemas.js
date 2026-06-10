/**
 * Validation Schemas using Joi
 */

import Joi from 'joi';

// Custom email validator regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Weather options
const CUACA = ['Cerah', 'Berawan', 'Hujan', 'Badai'];

// Shrimp species - Hanya Vannamei
const JENIS_UDANG = ['Vannamei'];

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().max(100).optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().required()
});

export const calculateSchema = Joi.object({
  tambak_id: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.string().uuid(),
    Joi.allow(null)
  ).optional(),
  ph_air: Joi.number().precision(2).min(0).max(14).required(),
  suhu_air: Joi.number().precision(2).min(0).max(50).required(),
  cuaca: Joi.string().valid(...CUACA).required(),
  volume_air: Joi.number().positive().required(),
  jumlah_udang: Joi.number().integer().positive().required(),
  usia_udang: Joi.number().integer().min(1).max(365).required(),
  notes: Joi.string().max(500).allow('').optional()
});

export const tambakSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(500).allow('').optional(),
  volume_air: Joi.number().positive().required(),
  location_lat: Joi.number().min(-90).max(90).optional(),
  location_long: Joi.number().min(-180).max(180).optional()
});

export const updateProfileSchema = Joi.object({
  full_name: Joi.string().max(100).optional(),
  email: Joi.string().pattern(emailRegex).optional()
}).min(1);

export const speciesSchema = Joi.object({
  nama: Joi.string().max(50).required(),
  nama_ilmiah: Joi.string().max(100).optional(),
  fcr: Joi.number().positive().required(),
  growth_rate: Joi.number().positive().required(),
  deskripsi: Joi.string().max(500).optional()
});

export { CUACA, JENIS_UDANG };
