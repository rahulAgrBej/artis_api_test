
// Modules
import { NextFunction, Request, Response } from 'express';
import { snetCols, snetWeightTypes, snetHabitats, snetMethods, snetExportSources } from '../db/snet';
import Joi from 'joi';

const Schemas = {

    queryReq: Joi.object({
        colsWanted: Joi.array().required(),// Joi.array().items(Joi.string().valid(...snetCols)).required(),
        weightType: Joi.string().valid(...snetWeightTypes).required(),
        searchCriteria: Joi.object({
            exporter_iso3c: Joi.array().items(Joi.string().length(3).uppercase()).optional(),
            importer_iso3c: Joi.array().items(Joi.string().length(3).uppercase()).optional(),
            source_country_iso3c: Joi.array().items(Joi.string().length(3).uppercase()).optional(),
            // needs to follow a 6 digit string
            hs6: Joi.array().items(Joi.string().length(6).regex(new RegExp(/\d+/))).optional(),
            //sciname: Joi.array().items(Joi.string().regex(new RegExp(/[^[a-zA-Z\s]+/))).optional(),
            sciname: Joi.array().items(Joi.string()).optional(),
            habitat: Joi.array().items(Joi.string().valid(...snetHabitats)).optional(),
            method: Joi.array().items(Joi.string().valid(...snetMethods)).optional(),
            dom_source: Joi.array().items(Joi.string().valid(...snetExportSources)).optional(),
            year: Joi.array().items(Joi.number().min(1996).max(2020)).sort().length(2).optional()
        }).optional()
    })
}

export default Schemas;
