import * as R from "ramda";
import * as K from "@fpk/k8s";
import { TDefaultContext } from "../contexts/default";

const container = R.pipe(
  () => K.containerWithPorts("myapp", "myimage", { http: 3000 }),
  K.concatEnv({ FOO: "bar" }),
)();

export default ({ myapp }: TDefaultContext) =>
  K.withNamespace("myapp")({
    "10-deployment": R.pipe(
      () => K.deploymentWithContainer("mydeploy", container),
      K.setReplicas(myapp.replicas),
    )(),
  });
