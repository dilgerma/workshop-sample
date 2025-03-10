import {Cartcleared} from "@/app/api/events/Cartcleared";
import {InventoryUpdated} from "@/app/api/events/InventoryUpdated";
import {Inventorychanged} from "@/app/api/events/Inventorychanged";
import {CartPublished} from "@/app/api/events/CartPublished";
import {Cartsubmitted} from "@/app/api/events/Cartsubmitted";
import {ItemAdded} from "@/app/api/events/ItemAdded";
import {ItemArchived} from "@/app/api/events/ItemArchived";
import {ItemArchiveRequested} from "@/app/api/events/ItemArchiveRequested";
import {Pricechanged} from "@/app/api/events/Pricechanged";
import {Itemremoved} from "@/app/api/events/Itemremoved";
import {ItemAdded} from "@/app/api/events/ItemAdded";

export type CartEvents = Cartcleared | 
InventoryUpdated | 
Inventorychanged | 
CartPublished | 
Cartsubmitted | 
ItemAdded | 
ItemArchived | 
ItemArchiveRequested | 
Pricechanged | 
Itemremoved | 
ItemAdded