function cloneBizTrackData(data) {
    return JSON.parse(JSON.stringify(data));
}

function loadBizTrackCollection(key, fallbackData, isValidItem) {
    const fallback = cloneBizTrackData(fallbackData);

    try {
        const storedData = localStorage.getItem(key);

        if (!storedData) {
            saveBizTrackCollection(key, fallback);
            return fallback;
        }

        const parsedData = JSON.parse(storedData);

        if (!Array.isArray(parsedData)) {
            throw new Error(`${key} must contain an array.`);
        }

        if (typeof isValidItem === "function" && !parsedData.every(isValidItem)) {
            throw new Error(`${key} contains invalid item data.`);
        }

        return parsedData;
    } catch (error) {
        console.warn(`Resetting invalid localStorage data for ${key}.`, error);
        saveBizTrackCollection(key, fallback);
        return fallback;
    }
}

function isPlainBizTrackObject(item) {
    return item !== null && typeof item === "object" && !Array.isArray(item);
}

function isNonEmptyBizTrackString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isBizTrackNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
}

function isBizTrackProduct(item) {
    return isPlainBizTrackObject(item)
        && isNonEmptyBizTrackString(item.prodID)
        && isNonEmptyBizTrackString(item.prodName)
        && isNonEmptyBizTrackString(item.prodDesc)
        && isNonEmptyBizTrackString(item.prodCat)
        && isBizTrackNumber(item.prodPrice)
        && Number.isInteger(item.prodSold);
}

function isBizTrackOrder(item) {
    return isPlainBizTrackObject(item)
        && isNonEmptyBizTrackString(item.orderID)
        && isNonEmptyBizTrackString(item.orderDate)
        && isNonEmptyBizTrackString(item.itemName)
        && isBizTrackNumber(item.itemPrice)
        && Number.isInteger(item.qtyBought)
        && isBizTrackNumber(item.shipping)
        && isBizTrackNumber(item.taxes)
        && isBizTrackNumber(item.orderTotal)
        && isNonEmptyBizTrackString(item.orderStatus);
}

function isBizTrackTransaction(item) {
    return isPlainBizTrackObject(item)
        && Number.isInteger(item.trID)
        && isNonEmptyBizTrackString(item.trDate)
        && isNonEmptyBizTrackString(item.trCategory)
        && isBizTrackNumber(item.trAmount)
        && isNonEmptyBizTrackString(item.trNotes);
}

function saveBizTrackCollection(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.warn(`Unable to save localStorage data for ${key}.`, error);
        return false;
    }
}
