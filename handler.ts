import {DynamoDB} from "aws-sdk";

export function saveData(event: any, context: any, callback: any) {
    try {
        const dynamodb = new DynamoDB();
        let tableName;
        switch (event.metadata.stage) {
            case "staging":
                tableName = "Homeplanit-Users-Staging";
                break;
        }
        if (!tableName) {
            throw new Error(`No table defined for stage ${event.metadata.stage}`)
        }
        dynamodb.putItem({
            Item: DynamoDB.Converter.marshall({...event.data, ...{username: event.user}}),
            TableName: tableName,
        }, (error: any) => {
            callback(error, JSON.stringify({
                statusCode: error ? 500 : 200,
            }));
        });
    } catch (e) {
        console.error(e);
        callback("An unexpected error occurred.");
    }
}

export default saveData;