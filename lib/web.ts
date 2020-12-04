import * as K from "@fpk/k8s";
import * as R from "ramda";

export interface IWebWorkloadOpts {
  name: string;
  replicas: number;

  image: string;
  containerPort: number;
  env: K.IEnvObject;
  config: Record<string, string>;

  host: string;
}

export function webWorkload({
  name,
  image,
  replicas,
  containerPort,
  config,
  env,
  host,
}: IWebWorkloadOpts) {
  const configMap = K.configMap("env-config", config);
  const container = R.pipe(
    () => K.containerWithPort(name, image, containerPort),
    K.concatEnv(env),
    K.appendEnvFromConfigMap(configMap),
    K.setReadinessProbe(),
    K.setLivenessProbe(),
  )();

  const deployment = R.pipe(
    () => K.deploymentWithContainer(name, container),
    K.setReplicas(replicas),
    K.setDeploymentRollingUpdate({
      maxSurge: "25%",
      maxUnavailable: 2,
    }),
    K.appendContainer({
      name: "super-sidecar",
      image: "myorg/sidecar:v1.0.0",
    }),
  )();

  const service = K.serviceWithPorts(
    name,
    { app: name },
    { http: containerPort },
  );

  const ingress = K.ingressFromService(name, [host], service);

  return K.withNamespace(name)({
    "10-env-config": configMap,
    "10-deployment": deployment,
    "10-service": service,
    "10-ingress": ingress,
  });
}
