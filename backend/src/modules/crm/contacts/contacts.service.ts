import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CONTACT_REPOSITORY, ContactRepository } from './repositories/contact.repository.interface';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactEntity } from './entities/contact.entity';
import { AuditService } from '../../audit/audit.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class ContactsService {
  constructor(
    @Inject(CONTACT_REPOSITORY) private readonly contactRepository: ContactRepository,
    private readonly companiesService: CompaniesService,
    private readonly auditService: AuditService,
  ) {}

  findAll(): Promise<ContactEntity[]> {
    return this.contactRepository.findAll();
  }

  findEntityById(id: string): Promise<ContactEntity | null> {
    return this.contactRepository.findById(id);
  }

  async findOne(id: string): Promise<ContactEntity> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new NotFoundException('Contacto no encontrado');
    }
    return contact;
  }

  private async assertCompanyExists(companyId?: string): Promise<void> {
    if (!companyId) return;
    const company = await this.companiesService.findEntityById(companyId);
    if (!company) {
      throw new BadRequestException('companyId no corresponde a una empresa existente');
    }
  }

  async create(dto: CreateContactDto, actorEmail: string): Promise<ContactEntity> {
    await this.assertCompanyExists(dto.companyId);
    const created = await this.contactRepository.create({
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      position: dto.position ?? null,
      companyId: dto.companyId ?? null,
      ownerUserId: dto.ownerUserId ?? null,
    });
    this.auditService.log(actorEmail, 'contacts.create', `Contacto creado: ${created.name}`);
    return created;
  }

  async update(id: string, dto: UpdateContactDto, actorEmail: string): Promise<ContactEntity> {
    await this.findOne(id);
    await this.assertCompanyExists(dto.companyId);
    const updated = await this.contactRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Contacto no encontrado');
    }
    this.auditService.log(actorEmail, 'contacts.update', `Contacto actualizado: ${updated.name}`);
    return updated;
  }

  async remove(id: string, actorEmail: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactRepository.delete(id);
    this.auditService.log(actorEmail, 'contacts.delete', `Contacto eliminado: ${contact.name}`);
  }

  count(): Promise<number> {
    return this.contactRepository.count();
  }
}
