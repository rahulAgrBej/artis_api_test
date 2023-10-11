# How to make Requests to the ARTIS API

## Summary
<table>
    <tbody>
    <tr>
        <th>HTTP Request Type</th>
        <th>Endpoint</th>
        <th>Parameters</th>
        <th>Response</th>
    </tr>
    <tr>
        <td>GET</td>
        <td>/snet/query</td>
        <td>
        Required Parameters:
        <ul>
            <li>colsWanted (at least one value required): "exporter_iso3c", "importer_iso3c", "source_country_iso3c", "hs6", "sciname", "habitat", "method", "dom_source", "year". </li>
            <li>weightType (only one value can be selected): "product_weight_t" or "live_weight_t"</li>
        </ul>
        Optional Parameters:
        <ul>
            <li>searchCriteria: Object with key value pairs. Keys are ARTIS snet table column names and values are the values to filter those columns by.</li>
        </ul>
        </td>
        <td>
            List of objects where each object corresponds to a row of with the appropriate raw/filtered/summarized data from the ARTIS database.
        </td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/supplemental</td>
        <td>
        Required Parameters:
        <ul>
            <li>table: supplemental table name.</li>
            <li>variable: column name within supplemental table.</li>
        </ul>
        </td>
        <td>
        A list of strings representing unique values in the column requested.
        </td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/supplemental/query</td>
        <td>
        Required Parameters:
        <ul>
            <li>table: supplemental table name you want information from.</li>
            <li>colsWanted: columns include in the table requested.</li>
        </ul>
        Optional Parameters:
        <ul>
            <li>searchCriteria: Object with key value pairs. Keys are supplemental table's column names and values are the values to filter those columns by.</li>
        <ul>
        </td>
        <td>
            A list of object where each object represents a row of data in the supplemental table requested.
        </td>
    </tr>
    </tbody>
</table>

An indepth review of the API requests and responses is available below.

## Requests for Main ARTIS snet data

This section outlines how to make requests for data within the ARTIS snet table. Note that all requests require some kind of filtering criteria, if you would like to request the complete ARTIS snet data please send an email to [ENTER EMAIL HERE].

A request for the main ARTIS snet table consists of 3 fields:
- colsWanted **(REQUIRED)**: A list of strings containing the names of the columns used to summarize the ARTIS data you are requesting.
- weightType **(REQUIRED)**: A string either "live_weight_t" or "product_weight_t", denoting what mass measurement you would like to use. Note you can only choose ONE weightType.
- searchCriteria *(Optional)*: An object with key value pairs that is used to filter the ARTIS snet data down to a desired output. The keys need to be the ARTIS snet column names. All keys except for year, should have a list of strings denoting which values you want to keep in your output. The year parameter should be a list of integers of length 2, where the first integer is the start year and the second integer is the end year, denoting the timeframe of ARTIS data you want to request.

### Examples

If you wanted to send a request for all ARTIS snet data summarize by year you would send the following request.

*Note:* In this request we are NOT performing any filtering on the ARTIS snet.
```json
{
    "colsWanted": ["year"],
    "weightType": "live_weight_t"
}
```
Here is a sample response:
```json
[
    {
        "year": 2020,
        "live_weight_t": 44166033.00951629
    },
    {
        "year": 2015,
        "live_weight_t": 40891197.02143691
    },
    {
        "year": 2018,
        "live_weight_t": 46537958.721290946
    },
    {
        "year": 2017,
        "live_weight_t": 44763794.736794
    },
    {
        "year": 2019,
        "live_weight_t": 45180309.70194027
    },
    {
        "year": 2016,
        "live_weight_t": 41962089.008993454
    }
]
```


If you wanted to send the same request but only for US and China capture trade from 2017 - 2019 you would edit the request like this:
```json
{
    "colsWanted": ["exporter_iso3c", "year"],
    "weightType": "live_weight_t",
    "searchCriteria": {
        "exporter_iso3c": ["CHN", "USA"],
        "method": ["capture"],
        "year": [2017, 2019]
    }
}
```

Here is a sample response:
```json
[
    {
        "exporter_iso3c": "USA",
        "year": 2017,
        "live_weight_t": 1975004.9836222837
    },
    {
        "exporter_iso3c": "CHN",
        "year": 2018,
        "live_weight_t": 3086899.0878980905
    },
    {
        "exporter_iso3c": "USA",
        "year": 2019,
        "live_weight_t": 1699555.4157051465
    },
    {
        "exporter_iso3c": "CHN",
        "year": 2019,
        "live_weight_t": 2960335.342349926
    },
    {
        "exporter_iso3c": "CHN",
        "year": 2017,
        "live_weight_t": 3256231.7707880796
    },
    {
        "exporter_iso3c": "USA",
        "year": 2018,
        "live_weight_t": 1807505.2796781566
    }
]
```

If you wanted to explore bilateral trade relationships for a specific species (salmo salar) in 2019, you would send the following request:
```json
{
    "colsWanted": ["exporter_iso3c", "importer_iso3c", "year"],
    "weightType": "live_weight_t",
    "searchCriteria": {
        "sciname": ["salmo salar"],
        "year": [2019, 2019]
    }
}
```
Here is a sample response:

```json
[
    {
        "exporter_iso3c": "AUS",
        "importer_iso3c": "CHN",
        "year": 2019,
        "live_weight_t": 7919.87229991926
    },
    {
        "exporter_iso3c": "BEL",
        "importer_iso3c": "COG",
        "year": 2019,
        "live_weight_t": 5205.84567743523
    },
    {
        "exporter_iso3c": "BEL",
        "importer_iso3c": "NLD",
        "year": 2019,
        "live_weight_t": 2997.68945007121
    },
```
---
## Requests for Supplemental data

This is section outline how to make requests for any of the supplemental data tables:
- baci
- countries
- production
- products
- sciname

You can make 2 kinds of requests for data in supplemental tables:
1. Getting all the unique values for a specific table. These requests are made to the url: ```/supplemental/```
    - This type of request has two REQUIRED parameters:
        - table: A string corresponding to the name of the supplemental table you want information from.
        - variable: A string corresponding to the name of the column. Will return all unique values in this column.
2. Getting all rows based on a filtered search criteria. These requests are made to the url: ```/supplemental/query/```
    - This type of the request has the uses the following parameters:
        - table **(REQUIRED)**: A string corresponding to the name of the supplemental table you want information from.
        - colsWanted **(REQUIRED)**: A list of strings corresponding to the columns that will be returned for each row.
        - searchCriteria *(Optional)*: An object with key value pairs that is used to filter the ARTIS snet data down to a desired output. The keys need to be the column names of the specific supplemental table being requested from. All keys should have a list of strings denoting which values you want to keep in your output.

### Examples

If you wanted to get all scientific names for all the species / species groups in ARTIS:
```json
{
    "table": "sciname",
    "variable": "sciname"
}
```

Here is sample response:
```json
{
    "sciname": [
        "eucinostomus melanopterus",
        "nassarius",
        "merlucciidae",
        "stellifer minor",
        "malacocephalus occidentalis",
        "patagonotothen ramsayi",
        "pomadasys kaakan",
        "carangoides malabaricus"
    ]
}
```

If you wanted to get all common names for all the species / species groups in ARTIS:
```json
{
    "table": "sciname",
    "variable": "common_name"
}
```

Here is a sample response:
```json
"common_name": [
        "scomber mackerels nei",
        "mango tilapia",
        "ocellated wedge sole",
        "spotted porcupinefish",
        "shi drum",
        "leopard fish",
        "globose clam",
        "geelbek croaker"
]
```

If you wanted to get all scientific, common names and ISSCAAP groups for a specific genus (for example thunnus):
```json
{
    "table": "sciname",
    "colsWanted": ["sciname", "common_name", "isscaap"],
    "searchCriteria": {
        "genus": ["thunnus"]
    }
}
```
Here is a sample response:
```json
[
    {
        "sciname": "thunnus",
        "common_name": "tunas nei",
        "isscaap": "Tunas, bonitos, billfishes"
    },
    {
        "sciname": "thunnus alalunga",
        "common_name": "albacore",
        "isscaap": "Tunas, bonitos, billfishes"
    }
]
```

If you wanted to get production of all USA and Chilean salmo salar by production method and year:
```json
{
    "table": "production",
    "colsWanted": ["iso3c", "method", "year", "live_weight_t"],
    "searchCriteria": {
        "sciname": ["salmo salar"],
        "iso3c": ["USA", "CHL"]
    }
}
```
Here is a sample response:
```json
[
    {
        "iso3c": "CHL",
        "sciname": "salmo salar",
        "method": "aquaculture",
        "habitat": "inland",
        "live_weight_t": 493.49,
        "year": 2018
    },
    {
        "iso3c": "CHL",
        "sciname": "salmo salar",
        "method": "aquaculture",
        "habitat": "marine",
        "live_weight_t": 660644.9,
        "year": 2018
    },
    {
        "iso3c": "USA",
        "sciname": "salmo salar",
        "method": "aquaculture",
        "habitat": "marine",
        "live_weight_t": 16107,
        "year": 2018
    }
]
```


