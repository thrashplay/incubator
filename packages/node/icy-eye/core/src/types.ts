// export interface Artifact<TDetails extends object = object> {
//   id: string
//   details: TDetails
//   facts: Fact[]
//   type: string
// }

import { EventEmitter } from 'events'

import { cloneDeep, isString } from 'lodash'
import TypedEmitter from 'typed-emitter'

export class Artifact<TDetails extends object = object> {
  private readonly _facts = [] as Fact[]

  public constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly details: TDetails,
  ) { }

  public facts() {
    return cloneDeep(this._facts)
  }

  public recordFact(fact: Fact | string) {
    if (isString(fact)) {
      this._facts.push({
        assertions: undefined,
        type: fact,
      })
    } else {
      this._facts.push(cloneDeep(fact))
    }
  }
}

export interface Fact<TAssertions extends object | undefined = object | undefined> {
  assertions: TAssertions
  type: string
}

export interface Action {
  id: string
  version: string
}

export interface IcyEyeEvent<TName extends string> {
  name: TName
}
export interface ArtifactEvent<TName extends 'artifactCreated' | 'artifactDeleted'> extends IcyEyeEvent<TName> {
  artifact: Artifact
}

export interface IcyEyeEvents {
  artifactCreated: (event: ArtifactEvent<'artifactCreated'>) => void
  artifactDeleted: (event: ArtifactEvent<'artifactDeleted'>) => void
}

export interface Trigger<TType extends string> {
  type: TType
}

export interface ArtifactTrigger<TDetails extends object = object> extends Trigger<'artifact'> {
  artifact: Artifact<TDetails>
}

export class IcyEyeCore implements TypedEmitter<IcyEyeEvents> {
  
}

// Glossary:
//  * Artifact: tangible entity, such as a file, server, source commit, etc.
//  * Fact: verifiable truth or reality about the system and its artifacts
//  * Goal: a fact that is desired to be true
//  * Action: process that receives Facts and Artifacts and acts upon them
//  * Report: a declaration that a Fact has been discovered or verified
//  * Reporter: the entity making a Report
//  * Task: instance of an Action
//  * Trigger: 