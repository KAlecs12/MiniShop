import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Init1749553405034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create product table
    await queryRunner.createTable(
      new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          { name: 'description', type: 'text', isNullable: false },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'imageUrl', type: 'varchar', isNullable: true },
          { name: 'stock', type: 'int', default: 0 },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create stock table
    await queryRunner.createTable(
      new Table({
        name: 'stock',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'productId', type: 'int', isNullable: false },
          { name: 'quantity', type: 'int', isNullable: false },
        ],
      }),
      true,
    );

    // Add foreign key from stock.productId to product.id
    await queryRunner.createForeignKey(
      'stock',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedTableName: 'product',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    const table = await queryRunner.getTable('stock');

    if(!table) {
      throw new Error('Table "stock" does not exist');
    }

    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('productId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('stock', foreignKey);
    }
    await queryRunner.dropTable('stock');
    await queryRunner.dropTable('product');
  }
}
