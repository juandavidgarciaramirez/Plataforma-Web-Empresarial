import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { serviceService } from '@/services/service.service'
import { toast } from 'react-hot-toast'

export function useServices(filters?: any) {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => serviceService.getAll(filters),
  })
}

export function useService(slug: string) {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: () => serviceService.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: serviceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Servicio creado correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al crear servicio')
    },
  })
}