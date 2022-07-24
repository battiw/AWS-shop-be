"use strict";

export const basicAuthorizer = async (event, context, callback) => {
  console.log("EvEnT: ", event);

  if (event.type !== "TOKEN") {
    callback("Unauthorized");
    console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!====>>> &&&&`);
  }

  try {
    console.log(`@@@@@@@@@@@@@@@@@@@@====>>> ############`);

    const authorizationToken = event.authorizationToken;
    const encodedCreds = authorizationToken.split(" ")[1];
    const buff = Buffer.from(encodedCreds, "base64");
    const plainCreds = buff.toString("utf-8").split(":");
    const username = plainCreds[0];
    const password = plainCreds[1];

    console.log(`usernsme: ${username} and password: ${password}`);

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    callback(null, policy);
  } catch (error) {
    console.log(`ErRoR ===>>> ${error}`);
    callback(`Unauthorized: ${error.message}`);
  }
};

const generatePolicy = (principalId, resource, effect = "Allow") => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          // Resource:
          //   "arn:aws:lambda:eu-west-1:045079065180:function:import-service-dev-importProductsFile",
          Resource: resource,
          Effect: effect,
        },
      ],
    },
  };
};
