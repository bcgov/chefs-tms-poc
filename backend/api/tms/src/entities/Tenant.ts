import { Entity, PrimaryGeneratedColumn, Column, Timestamp, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { TenantUser } from './TenantUser'

@Entity('Tenant')
export class Tenant {

      @PrimaryGeneratedColumn('uuid', { name: 'id' })
      id:string

      @Column({length:30, name:'name', unique: true})
      name:string

      @OneToMany(()=>TenantUser,(tenantUser) => tenantUser.tenant, {
        cascade:true,
      })
      users:TenantUser[]

      @CreateDateColumn({ type: 'timestamp', name: 'created_datetime' })
      createdDateTime : Timestamp

      @UpdateDateColumn({ type: 'timestamp', name: 'updated_datetime' })
      updatedDateTime : Timestamp
}