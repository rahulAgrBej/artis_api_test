
// Modules
import { sendQuery } from './connect_db'

// year is a number array, all other filtering criteria are string arrays
interface ISnetSearchCriteria {
    [property: string]: string[] | number[];
}

// Snet DB request format
interface ISnetCriteria {
    colsWanted: string[],
    weightType: string,
    searchCriteria: ISnetSearchCriteria
}

// Creates SQL query for ARTIS snet table
const createSnetQuery = (criteria: ISnetCriteria): string => {
    // initial 
    let query = `SELECT ${criteria.colsWanted.join(', ')}, SUM(${criteria.weightType}) AS ${criteria.weightType} FROM snet`;

    // LEFT JOIN if there are any columns that are NOT IN snet

    // Finding all columns in query that are not in the snet table
    let missingCols: string[] = [];
    let missingCols2 = {
        "sciname": [],
        "products": [],
        "country": []
    };
    criteria.colsWanted.forEach((val) => {
        if (!snetSet.has(val)) {
            missingCols.push(val);
        }
    })

    // adding left join statement for missing columns
    if (missingCols.length > 0) {
        query = query + ` a LEFT JOIN (SELECT sciname, `
        missingCols.forEach((val) => {
            query = query + `${val}, `
        })

        query = query.slice(0, query.length - 2);
        query = query + ' FROM sciname) b ON a.sciname = b.sciname '
    }

    console.log("missing cols query:")
    console.log(query);


    // if there are filtering criteria
    if ('searchCriteria' in criteria) {
        query = query + ' WHERE ';

        // create conditions for all filtering criteria
        for (const k of Object.keys(criteria.searchCriteria)) {
            // year just has a min and max year
            if (k === 'year') {
                const minYear: number = Number(criteria.searchCriteria.year[0]);
                const maxYear: number = Number(criteria.searchCriteria.year[1]);

                query = query + `year >= ${minYear} AND year <= ${maxYear} AND `
            }
            else {
                let currCriteria: string[] = criteria.searchCriteria[k].map((item: string | number): string => {
                    return `\'${item}\'`;
                });

                // follows format 'VARIABLE in (list of valid values)'
                query = query + `${k} in (${currCriteria.join(', ')}) AND `
            }
        }
        // remove last ' AND '
        query = query.slice(0, query.length - 5);
    }

    // group weight values by columns requested
    query = query + ` GROUP BY ${criteria.colsWanted.join(', ')}`;
    console.log("end query")
    console.log(query)
    return query;
}

// Sends snet request to ARTIS database
export const sendSnetQuery = async (criteria: ISnetCriteria) => {
    // snet request to snet SQL query
    const query = createSnetQuery(criteria);
    try {
        // sending request to database
        const resp = await sendQuery(query);
        return resp;
    }
    catch(e) {
        console.log(e);
    }
}

export const snetCols: string[] = [
    'exporter_iso3c', 'importer_iso3c', 'source_country_iso3c',
    'hs6', 'sciname', 'method', 'habitat', 'dom_source', 'year'
];

const snetSet = new Set(snetCols);

export const snetWeightTypes: string[] = ['product_weight_t', 'live_weight_t'];
export const snetHabitats: string[] = ['inland', 'marine'];
export const snetMethods: string[] = ['capture', 'aquaculture'];
export const snetExportSources: string[] = ['domestic export', 'foreign export']
