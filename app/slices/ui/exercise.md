


## Exercise 7

In this exercise you´ll learn how to integrate 3rd party systems into your processes.

We will need the 3d Party Integration to issue payments.

<iframe width="800" height="444" src="https://www.loom.com/embed/d53bb268dd234da58869a7250acba41c?sid=835b0b02-9893-42a7-b52a-3801888c3cdd" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

You will work in **app/slices/Payment.tsx**

The Payment Processor subscribes to events in the 'Payment'-Stream and directly reacts to them.

```
 subscribeStream('Payment', async ()=>{
    let result = await findEventStore().readStream("Payment");
    let events = result?.events??[]
    await paymentProcessor(events as PaymentEvents[])
})
```

### Implement TODO List

Your task is to implement the TODO List for the payment processor.
The TODO List basically provides to payments to process with the external payment provider.

```
let paymentTodoItems = paymentTodosStateView(events)
if (paymentTodoItems.length > 0) {
        paymentAPI.executePayment(paymentTodoItems[0].id, paymentTodoItems[0].amount);
        let resultEvents = await confirmPaymentCommandHandler(events, {
            type: 'ConfirmPayment',
            data: {
                bookingId: paymentTodoItems[0].id
            }
        })
}
```

Your task is to implement **paymentTodosStateView(events)**

Here is the logic:

```
 events.forEach((event) => {
    switch (event.type) {
        case 'PaymentRequested':
            // opens the TODO Item. Payment was requested
        case 'PaymentProcessed':
            // closes the TODO Item. Payment processed successfully
        case 'PaymentFailed':
            // keeps the TODO Item open
    }
})
```


