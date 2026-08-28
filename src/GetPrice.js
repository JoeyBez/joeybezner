export default function GetPrice(width, height){
    const pricePerSquareInch = 1.25;
    const flat = 20;
    const materialCost = 2.78;

    const rateTotal =  flat + ((width * height) * pricePerSquareInch);
    const net = rateTotal + materialCost;

    return Math.ceil(net / 10) * 10;
}