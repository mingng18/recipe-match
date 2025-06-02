// Ingredient Capture Screen
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IngredientCapturePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Capture Ingredients</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Grocery Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="grocery-picture">Grocery Picture</Label>
            <Input id="grocery-picture" type="file" />
          </div>
          {/* TODO: Image preview area */}
          <Button className="mt-4">Upload & Scan Groceries</Button>
        </CardContent>
      </Card>

      {/* 
        TODO: Later, add a similar card for Recipe Photo Upload
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload Recipe Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="file" />
            <Button className="mt-2">Upload & Scan Recipe</Button>
          </CardContent>
        </Card>
      */}

      <Card>
        <CardHeader>
          <CardTitle>Detected Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Confirm or edit the ingredients found in your photo(s).
          </p>
          {/* TODO: List of detected ingredients (editable) */}
          <ul>
            {/* Example item - replace with dynamic list */}
            <li className="flex justify-between items-center py-1">
              <span>Tomato</span>
              <Button variant="outline" size="sm">Edit</Button>
            </li>
          </ul>
          <Button className="mt-4">Confirm Ingredients & Find Recipes</Button>
        </CardContent>
      </Card>
    </div>
  );
} 