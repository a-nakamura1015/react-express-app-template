import {
  GatewayVpcEndpointAwsService,
  IVpc,
  InterfaceVpcEndpointAwsService,
  IpAddresses,
  SubnetType,
  Vpc as _Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class Vpc extends Construct {
  // NOTE: 別スタックから参照できるようにする
  public readonly resource: IVpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.resource = new _Vpc(this, "Vpc", {
      availabilityZones: ["ap-northeast-1a", "ap-northeast-1c"],
      // NOTE: ネットワークアドレス部:16bit, ホストアドレス部:16bit
      ipAddresses: IpAddresses.cidr("192.168.0.0/16"),
      subnetConfiguration: [
        {
          name: "public",
          cidrMask: 26, // 小規模なので`/26`で十分(ネットワークアドレス部: 26bit, ホストアドレス部: 6bit)
          subnetType: SubnetType.PUBLIC,
        },
        // NOTE: 外部との通信はALBを介して行う(NATGatewayを介さない)ので、ISOLATEDを指定(ECRとの接続はVPCエンドポイントを利用する)
        {
          name: "isolated",
          cidrMask: 26,
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
      natGateways: 0,
      createInternetGateway: true,
    });

    // NOTE: VPCエンドポイントを作成
    this.resource.addInterfaceEndpoint("EcrEndpoint", {
      service: InterfaceVpcEndpointAwsService.ECR,
    });
    this.resource.addInterfaceEndpoint("EcrDkrEndpoint", {
      service: InterfaceVpcEndpointAwsService.ECR_DOCKER,
    });
    this.resource.addInterfaceEndpoint("CwLogsEndpoint", {
      service: InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    });
    this.resource.addInterfaceEndpoint("SecretsManagerEndpoint", {
      service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    });
    this.resource.addGatewayEndpoint("S3Endpoint", {
      service: GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnets: this.resource.isolatedSubnets,
        },
      ],
    });
  }
}
