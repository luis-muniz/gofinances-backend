import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class AddFKInTransactions1589290021939
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'FK_id_category_in_transactions',
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'transactions',
      'FK_id_category_in_transactions',
    );
  }
}
