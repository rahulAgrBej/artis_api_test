// Modules
import request from "supertest";
import app from "../app";

// tests for endpoint /sciname
describe("snet table", () => {

    // GET requests tests
    describe('GET /', () => {

        /* needs to:
           - return a 200 status code
           - be a non-empty array
           - all elements are non empty strings */
        it("should return live weight summarized by exporter (CHN, USA, RUS) and year", async () => {

            let outputCols: string[] = ["exporter_iso3c", "year", "method"];
            const weightOutput: string = "live_weight_t";
            const colsWantedRegExp: string = "^exporter_iso3c$|^year$|^method$";
            const exporters: string[] = ["CHN", "USA", "RUS"];
            const exportersRegExp: string = "^CHN$|^USA$|^RUS$";
            const methods: string[] = ["capture"];
            const years: number[] = [2017, 2019];
            const res = await request(app).get("/snet/query").send(
                {
                    colsWanted: outputCols,
                    weightType: weightOutput,
                    searchCriteria: {
                        "exporter_iso3c": exporters,
                        "method": methods,
                        "year": years
                    }
                }
                );

            outputCols.push(weightOutput);

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);

            // Checking every element in the body
            res.body.forEach((elem: any) => {

                // Check Return properties for each object
                expect(Object.keys(elem).length).toEqual(outputCols.length);
                expect(Object.keys(elem).sort()).toEqual(outputCols.sort());

                // Checking method
                expect(typeof elem["method"]).toBe("string");
                expect(elem["method"]).toBe(methods[0]);
                // Checking min and max year
                expect(elem["year"]).toBeGreaterThanOrEqual(years[0]);
                expect(elem["year"]).toBeLessThanOrEqual(years[1]);
                // Check to include only requested exporters
                expect(elem["exporter_iso3c"]).toEqual(expect.stringMatching(exportersRegExp));
                
            });
        });

        /* needs to:
           - return a 400 status code */ 
        it("should error when request is malformed", async() => {
            const scinameVar = 'sciname';
            const res = await request(app).get("/snet/query").send({
                 colsWanted: ["exporter_iso3c", "year"],
                 weightType: "live_wgt",
                 searchCriteria: {
                    year: [2017, 2019]
                 }
            });
            expect(res.status).toBe(400);
        });

    });
});