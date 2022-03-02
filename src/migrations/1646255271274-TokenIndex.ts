import {MigrationInterface, QueryRunner} from "typeorm";

export class TokenIndex1646255271274 implements MigrationInterface {
    name = 'TokenIndex1646255271274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_9b998bada7cff93fcb953b0c37\` ON \`user_entity\``);
        await queryRunner.query(`ALTER TABLE \`user_entity\` ADD UNIQUE INDEX \`IDX_9b998bada7cff93fcb953b0c37\` (\`username\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_3bc5a62c3907904dcad1b34892\` ON \`token_entity\` (\`userId\`, \`identifier\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3bc5a62c3907904dcad1b34892\` ON \`token_entity\``);
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP INDEX \`IDX_9b998bada7cff93fcb953b0c37\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_9b998bada7cff93fcb953b0c37\` ON \`user_entity\` (\`username\`)`);
    }

}
