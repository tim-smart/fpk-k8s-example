import * as K from "@fpk/k8s";
import { webWorkload } from "../lib/web";
import { TDefaultContext } from "../contexts/default";

export default ({ anotherwebapp: { host, replicas } }: TDefaultContext) => {
  const { configMap, deployment, service, ingress } = webWorkload({
    name: "another-web-app",
    replicas,

    image: "myorg/another-web-app:latest",
    containerPort: 3000,
    env: {},
    config: { PORT: "3000" },

    host,
  });

  return K.withNamespace("another-web-app")({
    "10-config": configMap,
    "20-deploy": deployment,
    "20-svc": service,
    "20-ing": ingress,
  });
};
