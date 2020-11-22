# Periodic Facet
A 'periodic' entity is able to respond to World actions related to the passing of time. There is no specific state or behavior associated with this facet. It merely marks entities that the engine will activate as time progresses in the simulation.

## State

* None defined.

## Selectors

* None defined.

## Recognized Actions

* **`timeElapsed`**: This action is sent to a periodic entity to indicate the game time has progressed. There are no guarantees of how much time will elapse between occurrences of this action, and the action's payload itself should be inspected to find out the current time. These actions will always have the `world` entity a their source,

## Recognized Transformations

* None defined.