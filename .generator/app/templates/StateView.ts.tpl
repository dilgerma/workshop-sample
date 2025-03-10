
let roomsStateView = (events: InventoryEvents[]): { name: string, pricePerNight: number, roomNumber: string }[] => {

    let result: { name: string, pricePerNight: number, roomNumber: string }[] = []
    events.forEach((event) => {
        switch (event.type) {
            case "RoomAdded":
                result.push({
                    name: event.data.name,
                    roomNumber: event.data.roomNumber,
                    pricePerNight: event.data.costPerNight
                })
        }
    })
    return result

}