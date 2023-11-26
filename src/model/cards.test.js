import { Card, ORDER_3_LEFT_CARD } from "./cards.js";

test('Order 3 Left', () => {
    expect(ORDER_3_LEFT_CARD.name).toBe("Order Three Units Left");
    expect(ORDER_3_LEFT_CARD).toBeInstanceOf(Card);
});

