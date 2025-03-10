import {ClearCart} from "@/app/api/commands/ClearCart";
import {ImportInventory} from "@/app/api/commands/ImportInventory";
import {PublishCart} from "@/app/api/commands/PublishCart";
import {ArchiveItem} from "@/app/api/commands/ArchiveItem";
import {RegisterItemArchiveRequest} from "@/app/api/commands/RegisterItemArchiveRequest";
import {ChangePrice} from "@/app/api/commands/ChangePrice";
import {RemoveItem} from "@/app/api/commands/RemoveItem";
import {AddItem} from "@/app/api/commands/AddItem";
import {CartEvents} from "@/app/api/events/CartEvents"


            let handleClearCart = (command: ClearCart): CartEvents[] => {
                return [{
                    type:'Cartcleared',
                    data: {
                        aggregateId: command.aggregateId
                    }
                }]
            }

            let handleImportInventory = (command: ImportInventory): CartEvents[] => {
                return [{
                    type:'InventoryUpdated',
                    data: {
                        inventory: command.inventory,
productId: command.productId
                    }
                }]
            }

            let handlePublishCart = (command: PublishCart): CartEvents[] => {
                return [{
                    type:'CartPublished',
                    data: {
                        aggregateId: command.aggregateId,
orderedProducts: command.orderedProducts,
totalPrice: command.totalPrice
                    }
                }]
            }

            let handleArchiveItem = (command: ArchiveItem): CartEvents[] => {
                return [{
                    type:'ItemArchived',
                    data: {
                        aggregateId: command.aggregateId,
productId: command.productId,
itemId: command.itemId
                    }
                }]
            }

            let handleRegisterItemArchiveRequest = (command: RegisterItemArchiveRequest): CartEvents[] => {
                return [{
                    type:'ItemArchiveRequested',
                    data: {
                        aggregateId: command.aggregateId,
productId: command.productId,
itemId: command.itemId
                    }
                }]
            }

            let handleChangePrice = (command: ChangePrice): CartEvents[] => {
                return [{
                    type:'Pricechanged',
                    data: {
                        price: command.price,
productId: command.productId
                    }
                }]
            }

            let handleRemoveItem = (command: RemoveItem): CartEvents[] => {
                return [{
                    type:'Itemremoved',
                    data: {
                        itemId: command.itemId
                    }
                }]
            }

            let handleAddItem = (command: AddItem): CartEvents[] => {
                return [{
                    type:'ItemAdded',
                    data: {
                        aggregateId: command.aggregateId,
description: command.description,
itemId: command.itemId,
name: command.name,
price: command.price,
productId: command.productId
                    }
                }]
            }
