import * as R from "remeda";
import * as K from "@fpk/k8s";
import { TContext } from "../contexts/types";

const container = R.pipe(
  K.containerWithPorts("myapp", "myimage", { http: 3000 }),
  K.concatEnv({ FOO: "bar" }),
);
const deployment = (replicas: number) =>
  R.pipe(
    K.deploymentWithContainer("mydeploy", container),
    K.setReplicas(replicas),
  );

export default ({ "basic-example": { replicas } }: TContext) =>
  K.withNamespace("myapp")({
    "10-deployment": deployment(replicas),
  });
