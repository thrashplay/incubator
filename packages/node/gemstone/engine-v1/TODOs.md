# Tasks and Future Considerations

* Extract 'store' into standalone, reusable package
* Implement an 'error reducer' concept: function that sees events and validates them against the state BEFORE they are dispatched to the reducer, allowing consistent handling of invalid events and removing validation logic from the state update reducer