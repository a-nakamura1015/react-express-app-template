import { Construct } from "constructs";

import {
  AwsLogDriver,
  Cluster,
  ContainerImage,
  CpuArchitecture,
  FargateService,
  FargateTaskDefinition,
  IEcsLoadBalancerTarget,
  Secret,
  TaskDefinitionRevision,
} from "aws-cdk-lib/aws-ecs";
import {
  Port,
  SubnetType,
  type IConnectable,
  type ISecurityGroup,
  type IVpc,
} from "aws-cdk-lib/aws-ec2";
import { IRepository } from "aws-cdk-lib/aws-ecr";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { RemovalPolicy } from "aws-cdk-lib";

interface EcsProps {
  /**
   * ECSを作成するVPC
   */
  readonly vpc: IVpc;

  /**
   * ECRリポジトリ
   */
  readonly repository: IRepository;
  /**
   * ECSと接続を行うリソース
   */
  readonly connections: {
    alb: IConnectable;
    //rds: IConnectable
  };

  readonly port: number;
  /**
   * コンテナに渡すシークレット
   */
  //readonly secrets: { [key: string]: Secret };
}

export class Ecs extends Construct {
  /**
   * ロードバランサーのターゲットに指定するリソース
   */
  public readonly loadBalancerTarget: IEcsLoadBalancerTarget;

  constructor(scope: Construct, id: string, props: EcsProps) {
    super(scope, id);

    // NOTE: ロググループの作成
    const logGroup = new LogGroup(this, "LogGroup", {
      logGroupName: `/ecs/sample-node-app-${id}`,
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_DAY,
    });
    const logDriver = new AwsLogDriver({
      logGroup,
      streamPrefix: "container",
    });

    // NOTE: クラスターの作成
    const cluster = new Cluster(this, "EcsCluster", {
      vpc: props.vpc,
    });

    // NOTE: タスク定義の作成
    const taskDefinition = new FargateTaskDefinition(
      this,
      "EcsTaskDefinition",
      {
        cpu: 256,
        memoryLimitMiB: 512,
        runtimePlatform: {
          cpuArchitecture: CpuArchitecture.ARM64,
        },
      }
    );

    // NOTE: Fargate起動タイプでサービスの作成
    const fargateService = new FargateService(this, "EcsFargateService", {
      serviceName: id,
      cluster,
      taskDefinition,
      desiredCount: 2,
      //securityGroups: [props.securityGroup],
      vpcSubnets: props.vpc.selectSubnets({
        subnetType: SubnetType.PRIVATE_ISOLATED,
      }),
      taskDefinitionRevision: TaskDefinitionRevision.LATEST,
    });

    // NOTE: FargateServiceは`default port`を持たないため、明示的に指定する
    fargateService.connections.allowFrom(props.connections.alb, Port.tcp(80)); // IConnectableを利用してECSとALBを接続
    //props.connections.rds.connections.allowDefaultPortFrom(fargateService); // IConnectableを利用してECSとRDSを接続

    taskDefinition.addContainer("Container", {
      image: ContainerImage.fromEcrRepository(props.repository),
      portMappings: [{ containerPort: props.port, hostPort: props.port }],
      //secrets: props.secrets,
      logging: logDriver,
    });

    // loadBalancerTargetを設定
    this.loadBalancerTarget = fargateService;
  }
}
