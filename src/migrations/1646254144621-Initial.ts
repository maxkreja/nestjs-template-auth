import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1646254144621 implements MigrationInterface {
    name = 'Initial1646254144621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_entity\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_9b998bada7cff93fcb953b0c37\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`token_entity\` (\`id\` varchar(36) NOT NULL, \`identifier\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`token_entity\` ADD CONSTRAINT \`FK_de044c3492e70d6d9511ee35792\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token_entity\` DROP FOREIGN KEY \`FK_de044c3492e70d6d9511ee35792\``);
        await queryRunner.query(`DROP TABLE \`token_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_9b998bada7cff93fcb953b0c37\` ON \`user_entity\``);
        await queryRunner.query(`DROP TABLE \`user_entity\``);
    }

}
