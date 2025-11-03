'use client';
import { ActividadList } from "@/components/(views)/actividad/ActividadList";

export default function ActividadPage() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
      <main className="flex flex-col gap-8 max-w-7xl mx-auto">
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Actividades
            </h1>
          </div>
          <ActividadList />
        </div>
      </main>
    </div>
  );
}
  