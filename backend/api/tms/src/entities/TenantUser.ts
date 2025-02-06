import { Entity, PrimaryGeneratedColumn, Column, Timestamp, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, OneToOne } from 'typeorm'
import { Tenant } from './Tenant'
import { SSOUser } from './SSOUser'

@Entity('TenantUser')
export class TenantUser {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @ManyToOne(() => SSOUser, { eager: true })
    @JoinColumn({ name: 'sso_id' })
    ssoUser: SSOUser

    @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant
  
    @Column({ type: 'varchar', length: 100 })
    role: string

    @CreateDateColumn({ type: 'timestamp', name: 'created_datetime' })
    createdDateTime : Timestamp

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_datetime' })
    updatedDateTime: Timestamp

}