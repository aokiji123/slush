using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGameTranslations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add new translation columns first
            migrationBuilder.AddColumn<string>(
                name: "NameTranslations",
                table: "Games",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionTranslations",
                table: "Games",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            migrationBuilder.AddColumn<string>(
                name: "DeveloperTranslations",
                table: "Games",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            migrationBuilder.AddColumn<string>(
                name: "PublisherTranslations",
                table: "Games",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            migrationBuilder.AddColumn<string>(
                name: "GenreTranslations",
                table: "Games",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            // Migrate existing data to JSON format
            migrationBuilder.Sql(@"
                UPDATE ""Games"" 
                SET ""NameTranslations"" = jsonb_build_object('uk', ""Name"", 'en', '')::jsonb
                WHERE ""Name"" IS NOT NULL AND ""Name"" != '';
            ");

            migrationBuilder.Sql(@"
                UPDATE ""Games"" 
                SET ""DescriptionTranslations"" = jsonb_build_object('uk', ""Description"", 'en', '')::jsonb
                WHERE ""Description"" IS NOT NULL AND ""Description"" != '';
            ");

            migrationBuilder.Sql(@"
                UPDATE ""Games"" 
                SET ""DeveloperTranslations"" = jsonb_build_object('uk', ""Developer"", 'en', '')::jsonb
                WHERE ""Developer"" IS NOT NULL AND ""Developer"" != '';
            ");

            migrationBuilder.Sql(@"
                UPDATE ""Games"" 
                SET ""PublisherTranslations"" = jsonb_build_object('uk', ""Publisher"", 'en', '')::jsonb
                WHERE ""Publisher"" IS NOT NULL AND ""Publisher"" != '';
            ");

            migrationBuilder.Sql(@"
                UPDATE ""Games"" 
                SET ""GenreTranslations"" = jsonb_build_object('uk', ""Genre"", 'en', '[]'::jsonb)::jsonb
                WHERE ""Genre"" IS NOT NULL AND array_length(""Genre"", 1) > 0;
            ");

            // Create indexes for performance
            migrationBuilder.Sql(@"
                CREATE INDEX idx_games_name_translations ON ""Games"" USING gin(""NameTranslations"");
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX idx_games_description_translations ON ""Games"" USING gin(""DescriptionTranslations"");
            ");

            // Drop old columns after data migration
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Developer",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Genre",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Publisher",
                table: "Games");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionTranslations",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "DeveloperTranslations",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "GenreTranslations",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "NameTranslations",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "PublisherTranslations",
                table: "Games");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Games",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Developer",
                table: "Games",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<List<string>>(
                name: "Genre",
                table: "Games",
                type: "text[]",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Games",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Publisher",
                table: "Games",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }
    }
}
