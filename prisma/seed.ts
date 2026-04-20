import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // === USERS ===
  const adminPassword = await bcrypt.hash("admin123", 10);
  const staffPassword = await bcrypt.hash("staff123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Aamir Admin",
      email: "admin@aamirfabrics.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "+92 300 1234567",
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: "Staff Member",
      email: "staff@aamirfabrics.com",
      password: staffPassword,
      role: "STAFF",
      phone: "+92 301 2345678",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+92 321 9876543",
      address: "123 Main Street",
      city: "Lahore",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Fatima Ali",
      email: "fatima@example.com",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+92 333 4567890",
      address: "456 Garden Town",
      city: "Karachi",
    },
  });

  console.log("✅ Users created");

  // === PRODUCTS ===
  const products = [
    // --- WOMEN ---
    {
      slug: "sapphire-emerald-embroidered-lawn",
      name: "Emerald Embroidered Lawn 3-Piece",
      brand: "Sapphire",
      category: "WOMEN",
      fabricType: "Lawn",
      price: 4500,
      originalPrice: 5200,
      description: "A stunning emerald green lawn suit featuring intricate gold thread embroidery on the neckline and borders. This 3-piece set includes a beautifully embroidered shirt, plain dyed trousers, and a chiffon dupatta with delicate spray work. Perfect for casual gatherings and everyday elegance.",
      images: JSON.stringify(["/images/category-women.png"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify(["Emerald Green", "Forest Green"]),
      stockQuantity: 25,
      isFeatured: true,
      isNewArrival: true,
      discountPrice: 4500,
      discountPercent: 13,
      discountExpiry: new Date("2026-04-30"),
    },
    {
      slug: "maria-b-blush-pink-chiffon",
      name: "Blush Pink Luxury Chiffon",
      brand: "Maria B",
      category: "WOMEN",
      fabricType: "Chiffon",
      price: 6200,
      description: "Ethereal blush pink chiffon ensemble with hand-embellished sequins and pearl detailing. The flowy silhouette drapes beautifully, making it ideal for formal events and festive occasions. Includes fully embroidered front and back panels with matching dupatta.",
      images: JSON.stringify(["/images/category-women.png"]),
      sizes: JSON.stringify(["S", "M", "L"]),
      colors: JSON.stringify(["Blush Pink", "Peach"]),
      stockQuantity: 15,
      isNewArrival: true,
    },
    {
      slug: "sana-safinaz-sage-organza",
      name: "Sage Green Luxury Organza",
      brand: "Sana Safinaz",
      category: "WOMEN",
      fabricType: "Organza",
      price: 7500,
      description: "Exquisite sage green organza fabric with multi-colored floral embroidery. This premium unstitched suit features mirror work detailing and comes with a hand-woven organza dupatta. A true masterpiece for wedding festivities.",
      images: JSON.stringify(["/images/category-women.png"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify(["Sage Green", "Mint"]),
      stockQuantity: 8,
      isFeatured: true,
      isBestSeller: true,
    },
    {
      slug: "khaadi-coral-printed-lawn",
      name: "Coral Bloom Printed Lawn",
      brand: "Khaadi",
      category: "WOMEN",
      fabricType: "Lawn",
      price: 3200,
      originalPrice: 3800,
      description: "Vibrant coral printed lawn with bold tropical floral patterns. This breezy summer collection features a digitally printed shirt with complementary printed chiffon dupatta and dyed cambric trousers. Easy to style for everyday wear.",
      images: JSON.stringify(["/images/category-women.png"]),
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
      colors: JSON.stringify(["Coral", "Peach", "Orange"]),
      stockQuantity: 40,
      isNewArrival: true,
    },
    {
      slug: "alkaram-teal-digital-lawn",
      name: "Teal Geometric Digital Lawn",
      brand: "Alkaram",
      category: "WOMEN",
      fabricType: "Lawn",
      price: 3500,
      description: "Contemporary teal lawn suit featuring modern geometric digital prints. The design balances traditional elements with a fresh, trendy aesthetic. Three-piece set with printed lawn shirt, dyed trousers, and printed chiffon dupatta.",
      images: JSON.stringify(["/images/category-women.png"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify(["Teal", "Turquoise"]),
      stockQuantity: 30,
    },
    {
      slug: "gul-ahmed-ivory-silk",
      name: "Ivory Silk Elegance",
      brand: "Gul Ahmed",
      category: "WOMEN",
      fabricType: "Silk",
      price: 8900,
      originalPrice: 10500,
      description: "Pure ivory silk suit with gold zari work and intricate tilla embroidery. This luxury formal piece features a heavily embellished front panel, plain silk back, and a tissue silk dupatta with four-sided border. Perfect for Eid and formal gatherings.",
      images: JSON.stringify(["/images/category-women.png"]),
      sizes: JSON.stringify(["S", "M", "L"]),
      colors: JSON.stringify(["Ivory", "Off White"]),
      stockQuantity: 5,
      isFeatured: true,
      isBestSeller: true,
      discountPrice: 8900,
      discountPercent: 15,
      discountExpiry: new Date("2026-05-15"),
    },
    {
      slug: "nishat-lavender-cotton",
      name: "Lavender Cotton Comfort",
      brand: "Nishat Linen",
      category: "WOMEN",
      fabricType: "Cotton",
      price: 2800,
      description: "Soft lavender cotton suit designed for maximum comfort without compromising on style. Features subtle embroidery on neckline and sleeves with a matching cotton dupatta. Ideal for daily wear in warmer months.",
      images: JSON.stringify(["/images/category-women.png"]),
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["Lavender", "Light Purple"]),
      stockQuantity: 50,
    },
    {
      slug: "maria-b-burgundy-velvet",
      name: "Royal Burgundy Velvet",
      brand: "Maria B",
      category: "WOMEN",
      fabricType: "Velvet",
      price: 12500,
      description: "Regal burgundy velvet shawl suit with gold dabka and pearl hand embroidery. The plush velvet fabric features a fully worked front and comes with a velvet shawl with four-sided embroidered border. A statement piece for winter weddings.",
      images: JSON.stringify(["/images/hero2.png"]),
      sizes: JSON.stringify(["S", "M", "L"]),
      colors: JSON.stringify(["Burgundy", "Maroon"]),
      stockQuantity: 0,
      isOutOfStock: true,
      restockDate: "2026-04-15",
      isBestSeller: true,
    },

    // --- MEN ---
    {
      slug: "gul-ahmed-charcoal-wash-wear",
      name: "Charcoal Premium Wash & Wear",
      brand: "Gul Ahmed",
      category: "MEN",
      fabricType: "Wash & Wear",
      price: 2900,
      description: "Premium quality charcoal wash & wear fabric that combines durability with comfort. This wrinkle-free fabric is perfect for professional and casual shalwar kameez. Easy to maintain with excellent color retention.",
      images: JSON.stringify(["/images/category-men.png"]),
      sizes: JSON.stringify(["M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["Charcoal", "Dark Grey"]),
      stockQuantity: 60,
      isBestSeller: true,
    },
    {
      slug: "junaid-jamshed-navy-kameez",
      name: "Navy Blue Premium Cotton Shalwar Kameez",
      brand: "Junaid Jamshed",
      category: "MEN",
      fabricType: "Cotton",
      price: 3500,
      description: "Classic navy blue cotton shalwar kameez with subtle self-print pattern. Made from premium Egyptian cotton for superior comfort and breathability. Features a mandarin collar with button placket and side slits.",
      images: JSON.stringify(["/images/category-men.png"]),
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["Navy Blue", "Royal Blue"]),
      stockQuantity: 35,
      isFeatured: true,
      isNewArrival: true,
    },
    {
      slug: "bonanza-white-cotton-kurta",
      name: "White Egyptian Cotton Kurta",
      brand: "Junaid Jamshed",
      category: "MEN",
      fabricType: "Cotton",
      price: 2500,
      originalPrice: 3200,
      description: "Pristine white Egyptian cotton kurta with minimalist design. Features fine stitching, a comfortable regular fit, and mother-of-pearl buttons. A wardrobe essential for Friday prayers and casual outings.",
      images: JSON.stringify(["/images/category-men.png"]),
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["White", "Off White"]),
      stockQuantity: 45,
      discountPrice: 2500,
      discountPercent: 22,
    },
    {
      slug: "gul-ahmed-black-jacquard",
      name: "Black Jacquard Formal",
      brand: "Gul Ahmed",
      category: "MEN",
      fabricType: "Jacquard",
      price: 5800,
      description: "Sophisticated black jacquard fabric with woven geometric patterns. This premium fabric has a lustrous sheen perfect for formal occasions. The self-textured pattern adds depth without being overdone.",
      images: JSON.stringify(["/images/category-men.png"]),
      sizes: JSON.stringify(["M", "L", "XL"]),
      colors: JSON.stringify(["Black", "Jet Black"]),
      stockQuantity: 20,
      isFeatured: true,
    },
    {
      slug: "alkaram-olive-khaddar",
      name: "Olive Winter Khaddar",
      brand: "Alkaram",
      category: "MEN",
      fabricType: "Khaddar",
      price: 3800,
      description: "Warm olive khaddar fabric in a rich, earthy tone perfect for winter months. The loosely woven texture provides excellent insulation while maintaining a stylish appearance. Ideal for unstitched shalwar kameez.",
      images: JSON.stringify(["/images/category-men.png"]),
      sizes: JSON.stringify(["M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["Olive", "Army Green"]),
      stockQuantity: 0,
      isOutOfStock: true,
      restockDate: "2026-04-01",
    },
    {
      slug: "sapphire-grey-wool-blend",
      name: "Steel Grey Wool Blend Shawl Suit",
      brand: "Sapphire",
      category: "MEN",
      fabricType: "Khaddar",
      price: 6500,
      description: "Premium steel grey wool blend suit with matching shawl. The fabric features a fine herringbone weave and comes with a woolen shawl for added warmth. A sophisticated choice for winter formal events.",
      images: JSON.stringify(["/images/category-men.png"]),
      sizes: JSON.stringify(["M", "L", "XL"]),
      colors: JSON.stringify(["Steel Grey", "Slate"]),
      stockQuantity: 12,
      isNewArrival: true,
      isBestSeller: true,
    },

    // --- KIDS ---
    {
      slug: "kids-pastel-cotton-frock",
      name: "Pastel Floral Cotton Frock",
      brand: "Khaadi",
      category: "KIDS",
      fabricType: "Cotton",
      price: 1800,
      description: "Adorable pastel floral cotton frock for little girls. Features a comfortable A-line silhouette with puff sleeves and a Peter Pan collar. Made from soft, skin-friendly cotton that is gentle on delicate skin.",
      images: JSON.stringify(["/images/category-kids.png"]),
      sizes: JSON.stringify(["2-3Y", "4-5Y", "6-7Y", "8-9Y"]),
      colors: JSON.stringify(["Pink", "Yellow", "Mint"]),
      stockQuantity: 30,
      isNewArrival: true,
    },
    {
      slug: "kids-festive-kurta-set",
      name: "Festive Embroidered Kurta Set",
      brand: "Junaid Jamshed",
      category: "KIDS",
      fabricType: "Cotton",
      price: 2200,
      description: "Charming embroidered cotton kurta set for boys, perfect for Eid and family gatherings. Includes a kurta with delicate embroidery on the neckline and plain shalwar. Available in vibrant festive colors.",
      images: JSON.stringify(["/images/category-kids.png"]),
      sizes: JSON.stringify(["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"]),
      colors: JSON.stringify(["Sky Blue", "White", "Mint Green"]),
      stockQuantity: 25,
      isFeatured: true,
    },
    {
      slug: "kids-denim-kurta",
      name: "Denim Style Cotton Kurta",
      brand: "Alkaram",
      category: "KIDS",
      fabricType: "Cotton",
      price: 1500,
      description: "Trendy denim-style cotton kurta for boys. Modern Western-meets-Eastern design with a chambray fabric and contrast stitching. Comfortable and durable for active kids.",
      images: JSON.stringify(["/images/category-kids.png"]),
      sizes: JSON.stringify(["4-5Y", "6-7Y", "8-9Y", "10-11Y"]),
      colors: JSON.stringify(["Light Blue", "Medium Blue"]),
      stockQuantity: 0,
      isOutOfStock: true,
    },
    {
      slug: "kids-printed-lawn-frock",
      name: "Summer Garden Printed Lawn",
      brand: "Sapphire",
      category: "KIDS",
      fabricType: "Lawn",
      price: 1600,
      originalPrice: 2000,
      description: "Breezy summer lawn frock with cheerful garden print for girls. Features flutter sleeves, a gathered waist, and a twirly skirt. Lightweight and perfect for hot summer days.",
      images: JSON.stringify(["/images/category-kids.png"]),
      sizes: JSON.stringify(["2-3Y", "4-5Y", "6-7Y", "8-9Y"]),
      colors: JSON.stringify(["Pink Floral", "Yellow Floral"]),
      stockQuantity: 18,
      isNewArrival: true,
      discountPrice: 1600,
      discountPercent: 20,
    },
    {
      slug: "kids-winter-velvet-suit",
      name: "Winter Velvet Prince Suit",
      brand: "Gul Ahmed",
      category: "KIDS",
      fabricType: "Velvet",
      price: 3200,
      description: "Luxurious velvet suit for boys featuring gold zari embroidery on the collar and cuffs. Comes with matching velvet shalwar. An elegant choice for winter weddings and formal celebrations.",
      images: JSON.stringify(["/images/category-kids.png"]),
      sizes: JSON.stringify(["3-4Y", "5-6Y", "7-8Y", "9-10Y"]),
      colors: JSON.stringify(["Navy", "Maroon", "Black"]),
      stockQuantity: 10,
      isBestSeller: true,
    },

    // Additional Women products
    {
      slug: "sapphire-aqua-lawn-collection",
      name: "Aqua Marine Luxury Lawn",
      brand: "Sapphire",
      category: "WOMEN",
      fabricType: "Lawn",
      price: 4200,
      description: "Fresh aqua marine lawn suit with modern geometric print and contrast embroidered border. This eye-catching design features a digitally printed lawn shirt, dyed cambric trousers, and a printed silk dupatta.",
      images: JSON.stringify(["/images/category-women.png"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify(["Aqua", "Turquoise"]),
      stockQuantity: 22,
      isNewArrival: true,
    },
    {
      slug: "gul-ahmed-rose-embroidered",
      name: "Rose Gold Embroidered Luxury",
      brand: "Gul Ahmed",
      category: "WOMEN",
      fabricType: "Embroidered",
      price: 9800,
      description: "Stunning rose gold luxury embroidered suit with heavy handwork including beads, sequins, and cutwork. Features a fully embroidered organza dupatta and matching silk trousers. A head-turner for weddings.",
      images: JSON.stringify(["/images/hero2.png"]),
      sizes: JSON.stringify(["S", "M", "L"]),
      colors: JSON.stringify(["Rose Gold", "Champagne"]),
      stockQuantity: 3,
      isFeatured: true,
      isBestSeller: true,
    },
    {
      slug: "khaadi-mustard-khaddar",
      name: "Mustard Winter Khaddar Suite",
      brand: "Khaadi",
      category: "WOMEN",
      fabricType: "Khaddar",
      price: 4200,
      originalPrice: 4800,
      description: "Warm mustard khaddar suit with traditional block print design. The handloom khaddar fabric is soft and warm, perfect for Punjab winters. Includes printed khaddar shirt, dyed trousers, and printed wool shawl.",
      images: JSON.stringify(["/images/category-women.png"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify(["Mustard", "Golden Yellow"]),
      stockQuantity: 15,
    },
    {
      slug: "nishat-black-formal-velvet",
      name: "Midnight Black Formal Velvet",
      brand: "Nishat Linen",
      category: "WOMEN",
      fabricType: "Velvet",
      price: 11000,
      description: "Opulent black velvet formal suit with silver thread embroidery and crystal embellishments. The rich velvet fabric glows under evening light. Complete set with embroidered velvet shawl and raw silk trousers.",
      images: JSON.stringify(["/images/hero2.png"]),
      sizes: JSON.stringify(["S", "M", "L"]),
      colors: JSON.stringify(["Black", "Midnight Blue"]),
      stockQuantity: 7,
      isBestSeller: true,
    },
    {
      slug: "sana-safinaz-peach-cotton",
      name: "Peach Blossom Pakistani Cotton",
      brand: "Sana Safinaz",
      category: "WOMEN",
      fabricType: "Cotton",
      price: 3400,
      description: "Feminine peach cotton suit with delicate floral embroidery on the bodice and sleeves. The soft cotton fabric offers breathable comfort for spring and summer. Includes printed lawn dupatta and dyed trousers.",
      images: JSON.stringify(["/images/category-women.png"]),
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
      colors: JSON.stringify(["Peach", "Soft Pink"]),
      stockQuantity: 35,
      isNewArrival: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ ${products.length} products created`);

  // === SAMPLE ORDERS ===
  const allProducts = await prisma.product.findMany();

  const order1 = await prisma.order.create({
    data: {
      userId: customer1.id,
      total: 7700,
      status: "DELIVERED",
      shippingName: "Ahmed Khan",
      shippingEmail: "ahmed@example.com",
      shippingPhone: "+92 321 9876543",
      shippingAddress: "123 Main Street",
      shippingCity: "Lahore",
      paymentMethod: "COD",
      items: {
        create: [
          { productId: allProducts[0].id, quantity: 1, price: 4500, size: "M", color: "Emerald Green" },
          { productId: allProducts[8].id, quantity: 1, price: 2900, size: "L", color: "Charcoal" },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: customer2.id,
      total: 12500,
      status: "SHIPPED",
      shippingName: "Fatima Ali",
      shippingEmail: "fatima@example.com",
      shippingPhone: "+92 333 4567890",
      shippingAddress: "456 Garden Town",
      shippingCity: "Karachi",
      paymentMethod: "JazzCash",
      items: {
        create: [
          { productId: allProducts[2].id, quantity: 1, price: 7500, size: "S", color: "Sage Green" },
          { productId: allProducts[5].id, quantity: 1, price: 8900, size: "M", color: "Ivory" },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      userId: customer1.id,
      total: 5800,
      status: "PROCESSING",
      shippingName: "Ahmed Khan",
      shippingEmail: "ahmed@example.com",
      shippingPhone: "+92 321 9876543",
      shippingAddress: "123 Main Street",
      shippingCity: "Lahore",
      paymentMethod: "EasyPaisa",
      items: {
        create: [
          { productId: allProducts[11].id, quantity: 1, price: 5800, size: "L", color: "Black" },
        ],
      },
    },
  });

  const order4 = await prisma.order.create({
    data: {
      userId: customer2.id,
      total: 3400,
      status: "PENDING",
      shippingName: "Fatima Ali",
      shippingEmail: "fatima@example.com",
      shippingPhone: "+92 333 4567890",
      shippingAddress: "456 Garden Town",
      shippingCity: "Karachi",
      paymentMethod: "COD",
      items: {
        create: [
          { productId: allProducts[3].id, quantity: 1, price: 3200, size: "M", color: "Coral" },
        ],
      },
    },
  });

  console.log("✅ 4 sample orders created");
  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Login credentials:");
  console.log("  Admin:    admin@aamirfabrics.com / admin123");
  console.log("  Staff:    staff@aamirfabrics.com / staff123");
  console.log("  Customer: ahmed@example.com / customer123");
  console.log("  Customer: fatima@example.com / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
