import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.us-west-2.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-west-2",
      signingServiceName: "bedrock",
    },
  }
);

// 添加 Bedrock 权限
bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      "arn:aws:bedrock:us-west-2::foundation-model/amazon.titan-text-express-v1",
    ],
    actions: ["bedrock:InvokeModel"],
  })
);