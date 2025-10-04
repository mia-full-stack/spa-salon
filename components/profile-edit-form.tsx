"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfile, type User } from "@/lib/auth"

interface ProfileEditFormProps {
  user: User
  onUpdate: (user: User) => void
}

export function ProfileEditForm({ user, onUpdate }: ProfileEditFormProps) {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updatedUser = updateUserProfile(user.id, { name, phone })

      if (!updatedUser) {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить профиль",
          variant: "destructive",
        })
        return
      }

      onUpdate(updatedUser)
      setIsEditing(false)

      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении профиля",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setName(user.name)
    setPhone(user.phone)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Редактировать профиль</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Имя</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="edit-phone">Телефон</Label>
              <Input id="edit-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Сохранение..." : "Сохранить"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Отмена
              </Button>
            </div>
          </form>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Редактировать данные</Button>
        )}
      </CardContent>
    </Card>
  )
}
