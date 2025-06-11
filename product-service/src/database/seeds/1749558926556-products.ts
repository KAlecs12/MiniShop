import { MigrationInterface, QueryRunner } from 'typeorm';

export class Product1749558926556 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert products
    await queryRunner.query(`
      INSERT INTO product ("name", "description", "price", "imageUrl", "stock", "createdAt", "updatedAt")
      VALUES ('iPhone 15', 'Latest Apple smartphone', 999.99, 'https://example.com/iphone15.jpg', 4, NOW(),
              NOW()),
             ('Samsung Galaxy S24', 'Flagship Samsung phone', 899.99, 'https://example.com/galaxys24.jpg', 5,
              NOW(), NOW()),
             ('iPad Pro', 'Apple tablet for professionals', 1199.99, 'https://example.com/ipadpro.jpg', 6, NOW(),
              NOW()),
             ('MacBook Air', 'Lightweight Apple laptop', 1299.99, 'https://example.com/macbookair.jpg', 4, NOW(),
              NOW()),
             ('Google Pixel 8', 'Google''s latest smartphone', 799.99, 'https://example.com/pixel8.jpg', 7, NOW(),
              NOW());
    `);

    // Insert stock for each product
    await queryRunner.query(`
      INSERT INTO stock ("productId", "quantity")
      SELECT id, stock
      FROM product
      WHERE name IN (
                     'iPhone 15',
                     'Samsung Galaxy S24',
                     'iPad Pro',
                     'MacBook Air',
                     'Google Pixel 8'
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove stocks and products
    await queryRunner.query(`
      DELETE
      FROM stock
      WHERE productId IN (SELECT id
                          FROM product
                          WHERE name IN (
                                         'iPhone 15',
                                         'Samsung Galaxy S24',
                                         'iPad Pro',
                                         'MacBook Air',
                                         'Google Pixel 8'
                            ));
    `);
    await queryRunner.query(`
      DELETE
      FROM product
      WHERE name IN (
                     'iPhone 15',
                     'Samsung Galaxy S24',
                     'iPad Pro',
                     'MacBook Air',
                     'Google Pixel 8'
        );
    `);
  }
}
