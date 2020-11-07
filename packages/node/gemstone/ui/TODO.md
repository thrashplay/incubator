# Open Items and Ideas - gemstone-ui

## Bugs
* Canvas does not properly resize down when window shrinks
* Issuing actions when a previous frame is selected is confusing, since it appears to do nothing
* Rewinding/Fast-Forwarding jumps straight to the end state instead of replaying the whole path
* If two targets attack each other, they do not move
* Double circles when rendering, due to separate animations (see tech debt)

## Enhancements
* 'Pick' logic for characters uses a hard-coded max distance instead of the target's size

## Tech Debt
* Avatar and overlay rendering is a mess after introducing canvas coordinate system