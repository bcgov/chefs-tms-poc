import { Entity, PrimaryGeneratedColumn, Column, Timestamp, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import { Tenant } from './Tenant'

@Entity('TenantUser')
export class TenantUser {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Index()
    @Column ({type: 'varchar', length: 32, name: "sso_user_id"})
    ssoUserId: string

    @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant
  
    @Column({ type: 'varchar', length: 15 })
    role: string

    @CreateDateColumn({ type: 'timestamp', name: 'created_datetime' })
    createdDateTime : Timestamp

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_datetime' })
    updatedDateTime: Timestamp

}