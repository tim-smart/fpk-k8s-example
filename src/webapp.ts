import * as K from "@fpk/k8s";
import { webWorkload } from "../lib/web";
import { TDefaultContext } from "../contexts/default";

export default ({ webapp: { replicas, host } }: TDefaultContext) => {
  const { configMap, deployment, service, ingress } = webWorkload({
    name: "mywebapp",
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
