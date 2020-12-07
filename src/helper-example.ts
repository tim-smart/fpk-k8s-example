import * as K from "@fpk/k8s";
import { webWorkload } from "../lib/web";
import { TContext } from "../contexts/types";

const name = "helper-example";

// This example uses the `webWorkload` helper function defined in lib/web.ts
export default ({ "helper-example": { replicas, host } }: TContext) => {
  const { configMap, deployment, service, ingress } = webWorkload({
    name,
    replicas,
    image: "myorg/myappimage:latest",
    containerPort: 8080,
    env: {
      FOO: "bar",
    },
    config: { key: "value" },
    host,
  });

  return K.withNamespace("mywebapp")({
    "10-config": configMap,
    "20-deploy": deployment,
    "20-svc": service,
    "20-ing": ingress,
  });
};
