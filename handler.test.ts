import handler from "./handler";
import LambdaTester from "lambda-tester";

var AWS = require('aws-sdk-mock');

AWS.mock("DynamoDB", "putItem", function(params: any, callback: (error: any, response?: any)=>void) {
    if (params && params.Item && params.Item.name && params.Item.name.S == "invalid") {
        callback("Oh no");
    } else {
        callback(null, JSON.stringify({
            statusCode: 200,
        }));
    }
});

describe("persistence handler", () => {
    it("updates the database on a request and returns 200 on a successful write", () => {
        return LambdaTester(handler)
            .event({
                metadata: {
                    state: "staging",
                },
            })
            .expectResult((result:any) => {
                const parsed = JSON.parse(result);
                expect(parsed.statusCode).toBe(200);
            });
    });
    it ("attempts to write to the database and return 500 on a failed write", () => {
        return LambdaTester(handler)
            .event({
                metadata: {
                    state: "staging",
                },
                data: {
                    name: "invalid"
                },
            })
            .expectError((result:any) => {
                console.log(result);
            });
    });
});