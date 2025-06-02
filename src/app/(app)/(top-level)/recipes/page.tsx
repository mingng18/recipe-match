"use client"; // If we plan to add interactive elements or hooks like useState

import React from "react";
import Link from "next/link";
import Image from "next/image"; // For placeholder/actual images
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, BookOpen, ShoppingBasket, Info } from "lucide-react";

// Dummy data for "Recipe of the Day" - mimicking your example
const recipeOfTheDay = {
  id: "lasagna-special",
  title: "Easy Italian Lasagna",
  author: "Samuel Marque",
  imageUrl: "/placeholders/lasagna-hero.jpg", // You'll need to add a placeholder image here
  skillLevel: "Skilled",
  time: "40 - 45 min",
  budget: "$25 - $40",
  tag: "Plate of the day",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      {/* Recipe of the Day - inspired by your image */}
        <Link href={`/recipes/${recipeOfTheDay.id}`}>

      <Card className="overflow-hidden shadow-lg">
        <div className="relative h-64 w-full md:h-80">
          {/* Placeholder for a stunning food image */}
          {recipeOfTheDay.imageUrl ? (
            <Image  
              src={recipeOfTheDay.imageUrl}
              alt={recipeOfTheDay.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <div className="bg-muted flex h-full items-center justify-center">
              <BookOpen size={48} className="text-muted-foreground" />
            </div>
          )}
          {recipeOfTheDay.tag && (
            <div className="bg-opacity-70 absolute top-4 left-4 flex items-center rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white">
              <Info size={14} className="mr-1.5" />{" "}
              {/* Or a specific icon like Star */}
              {recipeOfTheDay.tag}
            </div>
          )}
        </div>
        <CardContent className="bg-background p-6">
          <h2 className="mb-1.5 text-3xl font-bold tracking-tight text-gray-800 md:text-4xl">
            {recipeOfTheDay.title}
          </h2>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              by {recipeOfTheDay.author}
            </p>
            {/* TODO: Implement save to favorites functionality */}
            <Button
              variant="link"
              className="h-auto p-0 text-sm text-blue-600 hover:text-blue-800"
            >
              Save to favorites
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="text-muted-foreground grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="font-medium text-gray-700">
                {recipeOfTheDay.skillLevel}
              </p>
              <p>Level</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">{recipeOfTheDay.time}</p>
              <p>Time</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">
                {recipeOfTheDay.budget}
              </p>
              <p>Budget</p>
            </div>
          </div>
        </CardContent>

      </Card>
        </Link>

      {/* TODO: Add other sections like "Expiring Soon" or "My Favorite Recipes" */}
    </div>
  );
}
