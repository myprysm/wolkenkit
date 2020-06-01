import { DomainDefinition } from './DomainDefinition';
import { MiddlewareDefinition } from './MiddlewareDefinition';
import { PackageManifest } from './PackageManifest';
import { ViewsDefinition } from './ViewsDefinition';

export interface ApplicationDefinition {
  rootDirectory: string;

  packageManifest: PackageManifest;

  domain: DomainDefinition;

  views: ViewsDefinition;

  middleware?: MiddlewareDefinition;
}
