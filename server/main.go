package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type TodoDataStruct struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Body  string `json:"body"`
	Done  bool   `json:"done"`
}

func secondMain() {

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3006",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	todoList := []TodoDataStruct{}

	app.Get("/healthcheck", func(c *fiber.Ctx) error {
		return c.SendString("health checked")
	})

	app.Get("/api/todo", func(c *fiber.Ctx) error {
		return c.JSON(todoList)
	})

	app.Post("/api/todo", func(c *fiber.Ctx) error {
		todo := &TodoDataStruct{}
		if err := c.BodyParser((todo)); err != nil {
			return err
		}

		todo.ID = len(todoList) + 1
		todoList = append(todoList, *todo)

		return c.JSON(todoList)
	})

	app.Patch("/api/todo/:id/done", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")

		if err != nil {
			return c.Status(401).SendString(("Invalid param id"))
		}

		for i, t := range todoList {
			if t.ID == id {
				todoList[i].Done = true
				break
			}
		}

		return c.JSON(todoList)
	})

	log.Fatal(app.Listen(":4000"))

}
