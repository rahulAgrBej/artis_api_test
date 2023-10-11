
// Modules
import { Router } from 'express';
import { IMetadataCriteria, sendMetadataColQuery, sendMetadataQuery } from '../db';
import supplementalSchemas from '../schemas/supplemental';
import validateSchema from '../middleware/schemaValidator';
import { createRequire } from 'module';

// Router for supplementals
const router = Router();

// GET all distinct values from the ARTIS supplemental table for a particular column
router.get('/', validateSchema(supplementalSchemas.colReq), async (req, res) => {

    try {
        // supplemental metadata column
        const tblName: string = req.body.table;
        const colName: string = req.body.variable;
        // Requesting ARTIS database for a specific column
        const finalResult = await sendMetadataColQuery(tblName, colName);
        // returns results
        res.json(finalResult);
    }
    catch(e) {
        console.log(e);
    }
})

// GET specific columns and filter supplemental metadata based on certain criteria
router.get('/query', validateSchema(supplementalSchemas.queryReq), async (req, res) => {

    try {
        // Getting criteria from body
        const tblName: string = req.body.table;
        let criteria: any = {
            colsWanted: req.body.colsWanted,
        };
        if ('searchCriteria' in req.body) {
            criteria['searchCriteria'] = req.body.searchCriteria;
        }
        // Sending supplemental metadata request to ARTIS database
        const finalResult: any = await sendMetadataQuery(tblName, criteria);
        // Sending supplemental metadata back
        res.json(finalResult);
    }
    catch(e) {
        console.log(e);
    }
})

export default router;
