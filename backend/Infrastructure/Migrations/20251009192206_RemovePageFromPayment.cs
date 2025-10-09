using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovePageFromPayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Page",
                table: "Payments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Page",
                table: "Payments",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
