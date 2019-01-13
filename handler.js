"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
function saveData(event, context, callback) {
    try {
        const dynamodb = new aws_sdk_1.DynamoDB();
        let tableName;
        switch (event.metadata.state) {
            case "staging":
                tableName = "Homeplanit-Users-Staging";
                break;
        }
        if (!tableName) {
            return callback({
                message: "No table name defined for specified stage",
                statusCode: 500,
            });
        }
        dynamodb.putItem({
            Item: aws_sdk_1.DynamoDB.Converter.marshall(Object.assign(event.data, { username: event.user })),
            TableName: tableName,
        }, (error) => {
            callback(error, JSON.stringify({
                statusCode: 200,
            }));
        });
    }
    catch (e) {
        callback(e);
    }
}
exports.saveData = saveData;
