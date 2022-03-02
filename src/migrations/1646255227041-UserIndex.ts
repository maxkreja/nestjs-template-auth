import {MigrationInterface, QueryRunner} from "typeorm";

export class UserIndex1646255227041 implements MigrationInterface {
    name = 'UserIndex1646255227041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_9b998bada7cff93fcb953b0c37\` ON \`user_entity\``);
        await queryRunner.query(`ALTER TABLE \`user_entity\` ADD UNIQUE INDEX \`IDX_9b998bada7cff93fcb953b0c37\` (\`username\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP INDEX \`IDX_9b998bada7cff93fcb953b0c37\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_9b998bada7cff93fcb953b0c37\` ON \`user_entity\` (\`username\`)`);
    }

}
