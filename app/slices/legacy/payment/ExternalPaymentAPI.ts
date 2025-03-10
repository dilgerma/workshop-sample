/**
 * Dummy External Payment API.
 * Fails on odd amounts
 */
export const paymentAPI = {
    executePayment: (id:string, amount:number) => {
        if (amount % 2 == 0) {
            console.log("payment succesful")
        } else {
            let random = Math.random()
            if (random > 0.33) {
             throw Error("payment cannot be processed");
            }
        }
    }
}