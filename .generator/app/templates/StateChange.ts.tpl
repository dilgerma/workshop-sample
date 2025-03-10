const addItemCommandHandler = async (events: Event[], command: AddItemCommand): Promise<Event[]> => {

    var addedRooms = events.filter(it => it.type == "Component").reduce((acc: string[], event: Event) => {
        acc.push((event as RoomAdded).data.name);
        return acc; // Return the updated accumulator
    }, []);

    if (!addedRooms.includes(command.data.name)) {
        return [{
            type: 'RoomAdded',
            data: {
                name: command.data.name,
                roomNumber: command.data.roomNumber,
                costPerNight: command.data.costPerNight
            }
        } as RoomAdded];
    } else {
        throw Error("Cannot add room twice")
    }

}